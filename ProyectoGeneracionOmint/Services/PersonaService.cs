using ProyectoGeneracionOmint.Models;

namespace ProyectoGeneracionOmint.Services;

public class PersonaService
{
    private readonly List<Persona> _personas = new()
    {
        new Persona { Id = 1, Nombre = "Juan", Apellido = "Pérez", Email = "juan@mail.com", Edad = 30, Dni = 12345678, UsuarioId = 1 },
        new Persona { Id = 2, Nombre = "María", Apellido = "García", Email = "maria@mail.com", Edad = 25, Dni = 87654321, UsuarioId = 2 },
        new Persona { Id = 3, Nombre = "Carlos", Apellido = "López", Email = "carlos@mail.com", Edad = 35, Dni = 11223344, UsuarioId = 1 }
    };

    private readonly UsuarioService _usuarioService;

    // Inyectamos UsuarioService para poder buscar usuarios
    public PersonaService(UsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    public List<Persona> ObtenerTodas() => _personas;

    public Persona? ObtenerPorId(int id) => _personas.FirstOrDefault(p => p.Id == id);

    // retorna persona + datos de su usuario buscando por DNI
    public PersonaConUsuarioDto? ObtenerPersonaConUsuarioPorDni(int dni)
    {
        var persona = _personas.FirstOrDefault(p => p.Dni == dni);
        if (persona == null) return null;

        var usuario = _usuarioService.ObtenerPorId(persona.UsuarioId);
        if (usuario == null) return null;

        return new PersonaConUsuarioDto
        {
            Id = persona.Id,
            Nombre = persona.Nombre,
            Apellido = persona.Apellido,
            Email = persona.Email,
            Edad = persona.Edad,
            Dni = persona.Dni,
            NombreUsuario = usuario.NombreUsuario,
            Activo = usuario.Activo
        };
    }

    // agrega una nueva persona a la lista
    public Persona AgregarPersona(Persona persona)
    {
        persona.Id = _personas.Max(p => p.Id) + 1; // Auto-incrementa el Id
        _personas.Add(persona);
        return persona;
    }
}