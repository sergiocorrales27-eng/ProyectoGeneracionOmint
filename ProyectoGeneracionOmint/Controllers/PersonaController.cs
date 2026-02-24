using Microsoft.AspNetCore.Mvc;
using ProyectoGeneracionOmint.Models;
using ProyectoGeneracionOmint.Services;

namespace ProyectoGeneracionOmint.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PersonaController : ControllerBase
{
    private readonly PersonaService _personaService;

    public PersonaController(PersonaService personaService)
    {
        _personaService = personaService;
    }

    [HttpGet]
    public IActionResult ObtenerTodas() => Ok(_personaService.ObtenerTodas());

    [HttpGet("{id}")]
    public IActionResult ObtenerPorId(int id)
    {
        var persona = _personaService.ObtenerPorId(id);
        return persona is not null ? Ok(persona) : NotFound();
    }

    // GET /api/persona/dni/12345678 → retorna persona + usuario + activo
    [HttpGet("dni/{dni}")]
    public IActionResult ObtenerPorDni(int dni)
    {
        var resultado = _personaService.ObtenerPersonaConUsuarioPorDni(dni);
        return resultado is not null ? Ok(resultado) : NotFound("No se encontró persona con ese DNI");
    }

    // POST /api/persona → crea una nueva persona
    [HttpPost]
    public IActionResult CrearPersona([FromBody] Persona persona)
    {
        var nuevaPersona = _personaService.AgregarPersona(persona);
        return CreatedAtAction(nameof(ObtenerPorId), new { id = nuevaPersona.Id }, nuevaPersona);
    }
}