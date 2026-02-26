using Microsoft.AspNetCore.Mvc;
using ProyectoGeneracionOmint.Models;
using ProyectoGeneracionOmint.Services.Interfaces;

namespace ProyectoGeneracionOmint.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        var result = _authService.Login(request.Username, request.Password);

        if (!result.Success)
            return BadRequest(result.Message);

        return Ok(result.Usuario);
    }
}
