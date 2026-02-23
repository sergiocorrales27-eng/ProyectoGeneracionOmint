using System.Collections.Generic;
using ProyectoGeneracionOmint.Models;

namespace ProyectoGeneracionOmint.Services
{
    public class UserService
    {
        public List<User> ObtenerUsuarios()
        {
            return new List<User>
            {
                new User("Manolito", "1234", 1),
                new User("JoseJose", "5656", 2),
                new User("Pedrilon", "4501", 3)
            };
        }
    }
}