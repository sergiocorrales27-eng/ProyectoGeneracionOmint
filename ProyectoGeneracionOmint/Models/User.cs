namespace ProyectoGeneracionOmint.Models
{
    public class User
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public int UserId { get; set; }
        public User() { }
        public User(string username, string password, int userId)
        {
            Username = username;
            Password = password;
            UserId = userId;
        }
    }
}
