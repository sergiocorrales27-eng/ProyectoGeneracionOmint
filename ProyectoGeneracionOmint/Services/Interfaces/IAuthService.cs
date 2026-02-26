using ProyectoGeneracionOmint.Models;

public interface IAuthService
{
    (bool Success, string Message, Usuario? Usuario)
        Login(string username, string password);
}
