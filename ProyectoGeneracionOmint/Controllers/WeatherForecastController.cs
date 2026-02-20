using Microsoft.AspNetCore.Mvc;
using ProyectoGeneracionOmint.Services.Interfaces;
using System.Security.Cryptography.X509Certificates;

namespace ProyectoGeneracionOmint.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly IInterface _interface;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IInterface @interface)
        {
            _logger = logger;
            _interface = @interface;
        }

        [HttpGet(Name = "GetWeatherForecast")]
        public IEnumerable<WeatherForecast> Get()
        {
            string result = _interface.HaceAlgo();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }
    }
}
