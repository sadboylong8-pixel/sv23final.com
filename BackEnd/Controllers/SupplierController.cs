using BackEnd.Models;
using BackEnd.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SupplierController : ControllerBase
{
    private readonly SupplierService _Supplierservice;
    public SupplierController(SupplierService service)
    {
        _Supplierservice = service;
    }

    [HttpGet("Get")]
    public async Task<IActionResult> GetAll()
    {
        var Suppliers = await _Supplierservice.GetAllAsync();
        return Ok(Suppliers);
    }

    [HttpPost("Post")]
    public async Task<IActionResult> Add(Suppliers supplier)
    {
        var id = await _Supplierservice.CreateAsync(supplier);
        return new JsonResult(id.ToString());
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Suppliers supplier)
    {
        var result = await _Supplierservice.UpdateAsync(id, supplier);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _Supplierservice.DeleteAsync(id);
        return new JsonResult(result);
    }

    [HttpGet("FindOne/{id}")]
    public async Task<IActionResult> FindOne(string id)
    {
        var supplier = await _Supplierservice.GetOneAsync(id);
        return Ok(supplier);
    }
}
