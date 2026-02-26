using ProyectoGeneracionOmint.Models;

namespace ProyectoGeneracionOmint.Services;

public class UsuarioService : IUsuarioService
{
    private readonly List<Usuario> _usuarios = new()
    {
        new Usuario { Id = 1, NombreUsuario = "admin", Password = "admin123", Rol = "Administrador", Activo = true },
        new Usuario { Id = 2, NombreUsuario = "user1", Password = "user123", Rol = "Usuario", Activo = false }
    };

    public List<Usuario> ObtenerTodos() => _usuarios;

    public Usuario? ObtenerPorId(int id) => _usuarios.FirstOrDefault(u => u.Id == id);

    // agrega un nuevo usuario a la lista
    public Usuario AgregarUsuario(Usuario usuario)
    {
        usuario.Id = _usuarios.Max(u => u.Id) + 1;
        _usuarios.Add(usuario);
        return usuario;
    }
}