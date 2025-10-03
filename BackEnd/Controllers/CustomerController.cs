using BackEnd.Models;
using BackEnd.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomerController : ControllerBase
{
    private readonly CustomerService _customerService;
    public CustomerController(CustomerService service)
    {
        _customerService = service;
    }

    [HttpGet("Get")]
    public async Task<IActionResult> GetAll()
    {
        var Customers = await _customerService.GetAllAsync();
        return Ok(Customers);
    }

    [HttpPost("Post")]
    public async Task<IActionResult> Add(Customers customer)
    {
        var id = await _customerService.CreateAsync(customer);
        return new JsonResult(id.ToString());
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Customers customer)
    {
        var result = await _customerService.UpdateAsync(id, customer);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _customerService.DeleteAsync(id);
        return new JsonResult(result);
    }

    [HttpGet("FindOne/{id}")]
    public async Task<IActionResult> FindOne(string id)
    {
        var customer = await _customerService.GetOneAsync(id);
        return Ok(customer);
    }
}
