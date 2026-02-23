using System;
using System.Collections.Generic;
using ProyectoGeneracionOmint.Models;

namespace ProyectoGeneracionOmint.Services
{
    public class PersonService
    {
        public List<Person> ObtenerPersonas()
        {
            return new List<Person>
            {
                new Person(
                    "Juan",
                    "Rodriguez",
                    "34126789",
                    new DateTime(1995, 5, 10),
                    "Av. León Gallardo 742",
                    "juan.rodriguez@gmail.com",
                    "Masculino",
                    1123456789,
                    "Soltero"
                ),
                new Person(
                    "María",
                    "Jose",
                    "30986125",
                    new DateTime(1990, 8, 22),
                    "Papagayos 344",
                    "maria.jose@gmail.com",
                    "Femenino",
                    1198765432,
                    "Casada"
                )
            };
        }
    }
}

