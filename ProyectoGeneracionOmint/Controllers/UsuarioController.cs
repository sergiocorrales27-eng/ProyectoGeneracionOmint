using Microsoft.AspNetCore.Mvc;
using ProyectoGeneracionOmint.Services;

namespace ProyectoGeneracionOmint.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuarioController : ControllerBase
{
    private readonly UsuarioService _usuarioService;

    public UsuarioController(UsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    [HttpGet]
    public IActionResult ObtenerTodos() => Ok(_usuarioService.ObtenerTodos());

    [HttpGet("{id}")]
    public IActionResult ObtenerPorId(int id)
    {
        var usuario = _usuarioService.ObtenerPorId(id);
        return usuario is not null ? Ok(usuario) : NotFound();
    }
}