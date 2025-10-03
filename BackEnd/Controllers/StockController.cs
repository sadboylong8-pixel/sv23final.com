using BackEnd.Models;
using BackEnd.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StockController : ControllerBase
{
    private readonly StockService _stockService;
    public StockController(StockService service)
    {
        _stockService = service;
    }

    [HttpGet("Get")]
    public async Task<IActionResult> GetAll()
    {
        var products = await _stockService.GetAllAsync();
        return Ok(products);
    }

    [HttpPost("Post")]
    public async Task<IActionResult> Add(Stocks stock)
    {
        var id = await _stockService.CreateAsync(stock);
        return new JsonResult(id.ToString());
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Stocks stock)
    {
        var result = await _stockService.UpdateAsync(id, stock);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _stockService.DeleteAsync(id);
        return new JsonResult(result);
    }

    [HttpGet("FindOne/{id}")]
    public async Task<IActionResult> FindOne(string id)
    {
        var product = await _stockService.FindOneAsync(id);
        return Ok(product);
    }
}
