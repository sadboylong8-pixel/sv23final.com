using BackEnd.Models;
using BackEnd.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StaffController : ControllerBase
{
    private readonly StaffService _Staffservice;
    public StaffController(StaffService service)
    {
        _Staffservice = service;
    }

    [HttpGet("Get")]
    public async Task<IActionResult> GetAll()
    {
        var Staffs = await _Staffservice.GetAllAsync();
        return Ok(Staffs);
    }

    [HttpPost("Post")]
    public async Task<IActionResult> Add(Staffs staff)
    {
        var id = await _Staffservice.CreateAsync(staff);
        return new JsonResult(id.ToString());
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Staffs staff)
    {
        var result = await _Staffservice.UpdateAsync(id, staff);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _Staffservice.DeleteAsync(id);
        return new JsonResult(result);
    }

    [HttpGet("FindOne/{id}")]
    public async Task<IActionResult> FindOne(string id)
    {
        var staff = await _Staffservice.GetOneAsync(id);
        return Ok(staff);
    }
}
