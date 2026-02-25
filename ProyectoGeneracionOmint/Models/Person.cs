namespace ProyectoGeneracionOmint.Models
{
    public class Person
    {
        public string FirstName { get; set; }
        public string Lastname { get; set; }
        public string Id { get; set; }
        public DateTime BirthDay { get; set; }
        public string Adress { get; set; }
        public string Email { get; set; }
        public string Sex { get; set; }
        public int PhoneNumber { get; set; }
        public string CivilStatus { get; set; }
        public int UserId { get; set; }


        public Person() { }
        public Person(string firstName, string lastname, string id, DateTime birthDay, string adress, string email, string sex, int phoneNumber, string civilStatus, int userId)
        {
            FirstName = firstName;
            Lastname = lastname;
            Id = id;
            BirthDay = birthDay;
            Adress = adress;
            Email = email;
            Sex = sex;
            PhoneNumber = phoneNumber;
            CivilStatus = civilStatus;
            UserId = userId;
        }
    }
}
