using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AddressBook.Entities.Models.AddressBook
{
    public class Contact
    {
        public Contact()
        {
            PhoneNumbers = new HashSet<PhoneNumber>();
        }
        //Primary key
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }
        public virtual ICollection<PhoneNumber> PhoneNumbers { get; set; }
    }
}
