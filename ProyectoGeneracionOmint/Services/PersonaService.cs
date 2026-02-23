using ProyectoGeneracionOmint.Models;

namespace ProyectoGeneracionOmint.Services;

public class PersonaService
{
    private readonly List<Persona> _personas = new()
    {
        new Persona { Id = 1, Nombre = "Juan", Apellido = "Pérez", Email = "juan@mail.com", Edad = 30 },
        new Persona { Id = 2, Nombre = "María", Apellido = "García", Email = "maria@mail.com", Edad = 25 },
        new Persona { Id = 3, Nombre = "Carlos", Apellido = "López", Email = "carlos@mail.com", Edad = 35 }
    };

    public List<Persona> ObtenerTodas() => _personas;

    public Persona? ObtenerPorId(int id) => _personas.FirstOrDefault(p => p.Id == id);
}