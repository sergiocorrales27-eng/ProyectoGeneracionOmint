namespace ProyectoGeneracionOmint.Models;

public class Persona
{
    public int Id { get; set; }
    public string Nombre { get; set; }
    public string Apellido { get; set; }
    public string Email { get; set; }
    public int Edad { get; set; }
    public int Dni { get; set; }
    public int UsuarioId { get; set; }
}