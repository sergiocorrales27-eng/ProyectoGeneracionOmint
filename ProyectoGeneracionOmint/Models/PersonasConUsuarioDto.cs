namespace ProyectoGeneracionOmint.Models;

public class PersonaConUsuarioDto
{
    public int Id { get; set; }
    public string Nombre { get; set; }
    public string Apellido { get; set; }
    public string Email { get; set; }
    public int Edad { get; set; }
    public int Dni { get; set; }
    public string NombreUsuario { get; set; }
    public bool Activo { get; set; }
}