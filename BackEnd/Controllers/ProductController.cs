using BackEnd.Models;
using BackEnd.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly ProductService _productService;
    public ProductController(ProductService service)
    {
        _productService = service;
    }

    [HttpGet("Get")]
    public async Task<IActionResult> GetAll()
    {
        var products = await _productService.GetAllAsync();
        return Ok(products);
    }

    [HttpPost("Post")]
    public async Task<IActionResult> Add(Products product)
    {
        var id = await _productService.CreateAsync(product);
        return new JsonResult(id.ToString());
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Products product)
    {
        var result = await _productService.UpdateAsync(id, product);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _productService.DeleteAsync(id);
        return new JsonResult(result);
    }

    [HttpGet("FindOne/{id}")]
    public async Task<IActionResult> FindOne(string id)
    {
        var product = await _productService.GetOneAsync(id);
        return Ok(product);
    }
}
