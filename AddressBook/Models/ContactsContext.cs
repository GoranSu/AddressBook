using AddressBook.Common.Extensions;
using AddressBook.Entities.Models.AddressBook;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace AddressBook.Models
{
    public class ContactsContext : DbContext
    {
        public ContactsContext(DbContextOptions<ContactsContext> options)
            : base(options)
        {
        }

        public DbSet<Contact> Contacts { get; set; }
        public DbSet<PhoneNumber> PhoneNumbers { get; set; }


		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);

			foreach (var relationship in modelBuilder.Model.GetEntityTypes().Where(e => !e.IsOwned()).SelectMany(e => e.GetForeignKeys()))
			{
				relationship.DeleteBehavior = DeleteBehavior.Cascade;
			}

			foreach (var entity in modelBuilder.Model.GetEntityTypes())
			{
				entity.SetTableName(entity.GetTableName().ToSnakeCase());

				foreach (var property in entity.GetProperties())
				{
					property.SetColumnName(property.GetColumnName().ToSnakeCase());
				}

				foreach (var key in entity.GetKeys())
				{
					key.GetName().ToSnakeCase();
				}

				foreach (var key in entity.GetForeignKeys())
				{
					key.GetDefaultName().ToSnakeCase();
				}
			}
		}
	}
}