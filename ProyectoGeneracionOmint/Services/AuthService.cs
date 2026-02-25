using ProyectoGeneracionOmint.Models;

public class AuthService : IAuthService
{
    private readonly IUsuarioService _usuarioService;

    public AuthService(IUsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    public (bool Success, string Message, Usuario? Usuario)
        Login(string username, string password)
    {
        var usuario = _usuarioService
            .ObtenerTodos()
            .FirstOrDefault(u => u.NombreUsuario == username);

        if (usuario == null)
            return (false, "Usuario y contraseña inválidos", null);

        if (usuario.Password != password)
            return (false, "Usuario y contraseña inválidos", null);

        if (!usuario.Activo)
            return (false, "Usuario inactivo", null);

        return (true, "Login exitoso", usuario);
    }
}
