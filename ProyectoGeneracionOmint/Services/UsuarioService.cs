using ProyectoGeneracionOmint.Models;

namespace ProyectoGeneracionOmint.Services;

public class UsuarioService
{
    private readonly List<Usuario> _usuarios = new()
    {
        new Usuario { Id = 1, NombreUsuario = "admin", Password = "admin123", Rol = "Administrador" },
        new Usuario { Id = 2, NombreUsuario = "user1", Password = "user123", Rol = "Usuario" }
    };

    public List<Usuario> ObtenerTodos() => _usuarios;

    public Usuario? ObtenerPorId(int id) => _usuarios.FirstOrDefault(u => u.Id == id);
}