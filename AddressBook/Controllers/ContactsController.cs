using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AddressBook.Entities.Models.AddressBook;
using AddressBook.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AddressBook.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly ContactsContext _context;
        public ContactsController(ContactsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Contact>>> GetContacts()
        {
            List<Contact> contacts = null;

            try
            {
                contacts = new List<Contact>();
                contacts = await _context.Contacts.ToListAsync();
            }
            catch (Exception ex)
            {
                return Content(ex.InnerException.ToString());
            }

            return Ok(contacts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Contact>> GetContact(int id)
        {
            Contact contact = null;
            try
            {
                contact = new Contact();
                contact = await _context.Contacts.Where(c => c.Id == id)
                       .Include(c => c.PhoneNumbers)
                       .FirstOrDefaultAsync();

                if (contact == null)
                {
                    return NotFound();
                }
            }
            catch (Exception)
            {

                throw;
            }
            

            return contact;
        }

        [HttpPost]
        public async Task<ActionResult<Contact>> PostContact([FromBody] Contact contact)
        {
            try
            {
                contact.FullName = $"{contact.FirstName} {contact.LastName}";
                _context.Contacts.Add(contact);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return Content(ex.InnerException.ToString());
            }
            return CreatedAtAction("PostContact", new { id = contact.Id }, contact);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Contact>> PutContact(int id, [FromBody] Contact newContact)
        {
            if (id != newContact.Id || newContact == null)
            {
                return BadRequest();
            }

            try
            {

                Contact existingContact = await _context.Contacts.Where(c => c.Id == id)
                       .Include(c => c.PhoneNumbers)
                       .FirstOrDefaultAsync();

                existingContact.FirstName = newContact.FirstName;
                existingContact.LastName = newContact.LastName;
                existingContact.FullName = $"{newContact.FirstName} {newContact.LastName}";
                existingContact.Address = newContact.Address;
                existingContact.DateOfBirth = newContact.DateOfBirth;
                existingContact.PhoneNumbers = newContact.PhoneNumbers;

                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Content(ex.InnerException.ToString());
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Contact>> DeleteContact(int id)
        {
            try
            {
                Contact contact = await _context.Contacts.Where(c => c.Id == id)
                       .Include(c => c.PhoneNumbers)
                       .FirstOrDefaultAsync();

                if (contact != null)
                {
                    _context.Contacts.Remove(contact);
                }
                else
                {
                    return NotFound();
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return Content(ex.InnerException.ToString());
            }

            return NoContent();
        }
    }
}