using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AddressBook.Entities.Models.AddressBook
{
    public class PhoneNumber
    {
        public int Id { get; set; }
        //Foreign key
        public int ContactId { get; set; }
        public string Number { get; set; }
    }
}
