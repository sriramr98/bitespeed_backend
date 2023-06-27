import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Contact from './db/contact'

export default async (req: Request, res: Response) => {
    const { email, phoneNumber } = req.body;

    let contacts = await Contact.findAll({
        where: {
            [Op.or]: [{ email: email || null }, { phoneNumber: phoneNumber || null }],
        },
    });

    // Handle the edge case when the given email or phone number maps to secondary contacts
    let secondaryContacts = contacts.filter(contact => contact.linkPrecedence === "secondary");
    const secondaryLinkedUniqueIDs = new Set(secondaryContacts.map(c => c.linkedId).filter(Boolean))

    const primaries = await Contact.findAll({
        where: {
            id: {
                [Op.in]: [...secondaryLinkedUniqueIDs]
            },
            linkPrecedence: "primary"
        }
    })

    contacts = [...primaries, ...contacts];

    // Sort contacts by creation time.
    contacts.sort((a, b) => a.createdAt - b.createdAt);

    let primaryContact = contacts.find(contact => contact.linkPrecedence === "primary");

    // If there is no primary contact, create a new primary contact.
    if (!primaryContact) {
        primaryContact = await Contact.create({
            email,
            phoneNumber,
            linkPrecedence: "primary"
        });

        return res.json({
            contact: {
                primaryContatctId: primaryContact.id,
                emails: [primaryContact.email],
                phoneNumbers: [primaryContact.phoneNumber],
                secondaryContactIds: [],
            },
        })
    }

    // Create a new secondary contact if no contact matches both email and phoneNumber.
    if (!contacts.some(contact => contact.email === email && contact.phoneNumber === phoneNumber)) {
        const newContact = await Contact.create({
            email,
            phoneNumber,
            linkedId: primaryContact.id,
            linkPrecedence: "secondary"
        });
        contacts.push(newContact);
    }

    const idsToUpdate = []
    contacts.forEach(contact => {
        if (contact.id !== primaryContact.id) {
            idsToUpdate.push(contact.id)
        }
    })

    await Contact.update({
        linkedId: primaryContact.id,
        linkPrecedence: "secondary"
    }, {
        where: {
            id: {
                [Op.in]: idsToUpdate
            }
        }
    })

    secondaryContacts = await Contact.findAll({
        where: {
            linkedId: primaryContact.id,
            linkPrecedence: "secondary"
        }
    });

    return res.status(200).json({
        contact: {
            primaryContatctId: primaryContact.id,
            emails: [...new Set([primaryContact.email, ...secondaryContacts.map(c => c.email)].filter(c => !!c))],
            phoneNumbers: [...new Set([primaryContact.phoneNumber, ...secondaryContacts.map(c => c.phoneNumber)].filter(c => !!c))],
            secondaryContactIds: secondaryContacts.map(c => c.id),
        },
    });

}

