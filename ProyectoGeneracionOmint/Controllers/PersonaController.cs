using Microsoft.AspNetCore.Mvc;
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
}