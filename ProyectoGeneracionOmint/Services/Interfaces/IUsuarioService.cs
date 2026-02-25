
using ProyectoGeneracionOmint.Models;
public interface IUsuarioService
{
    List<Usuario> ObtenerTodos();
    Usuario? ObtenerPorId(int id);
    Usuario AgregarUsuario(Usuario usuario);
}
