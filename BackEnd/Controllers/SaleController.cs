using BackEnd.Models;
using BackEnd.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SaleController : ControllerBase
{
    private readonly SaleService _saleService;
    public SaleController(SaleService service)
    {
        _saleService = service;
    }

    [HttpGet("Get")]
    public async Task<IActionResult> GetAll()
    {
        var Sales = await _saleService.GetAllAsync();
        return Ok(Sales);
    }

    [HttpPost("Post")]
    public async Task<IActionResult> Add(Sales sale)
    {
        var id = await _saleService.CreateAsync(sale);
        return new JsonResult(id.ToString());
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Sales sale)
    {
        var result = await _saleService.UpdateAsync(id, sale);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _saleService.DeleteAsync(id);
        return new JsonResult(result);
    }

    [HttpGet("FindOne/{id}")]
    public async Task<IActionResult> FindOne(string id)
    {
        var sale = await _saleService.GetOneAsync(id);
        return Ok(sale);
    }
}
