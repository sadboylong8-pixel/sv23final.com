using BackEnd.Configurations;
using BackEnd.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace BackEnd.Services;

public class StockService
{
    private readonly IMongoCollection<Stocks> _collection;
    public StockService(IOptions<DatabaseSettings> databaseSetting)
    {
        var client = new MongoClient(databaseSetting.Value.ConnectionString);
        var database = client.GetDatabase(databaseSetting.Value.DatabaseName);
        _collection = database.GetCollection<Stocks>(databaseSetting.Value.CollectionStock);
    }

    public async Task<List<Stocks>> GetAllAsync()
    {
        return await _collection.Find(_ => true).ToListAsync();
    }

    public async Task<string> CreateAsync([FromBody] Stocks stock)
    {
        await _collection.InsertOneAsync(stock);
        return stock.Id;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var filter = Builders<Stocks>.Filter.Eq(s => s.Id, id);
        var result = await _collection.DeleteOneAsync(filter);
        return result.DeletedCount == 1;
    }

    public async Task<bool> UpdateAsync(string id, [FromBody] Stocks stock)
    {
        var filter = Builders<Stocks>.Filter.Eq(s => s.Id, id);
        var update = Builders<Stocks>.Update
            .Set(s => s.Ingredient, stock.Ingredient)
            .Set(s => s.Unit, stock.Unit)
            .Set(s => s.Quantity, stock.Quantity)
            .Set(s => s.CostPerUnit, stock.CostPerUnit)
            .Set(s => s.Total, stock.Total)
            .Set(s => s.SupplierId, stock.SupplierId)
            .Set(s => s.AddStockDate, stock.AddStockDate)
            .Set(s => s.ImageUrl, stock.ImageUrl);
        var result = await _collection.UpdateOneAsync(filter, update);
        return result.ModifiedCount == 1;
    }

    public async Task<List<Stocks>> FindOneAsync(string id)
    {
        var filter = Builders<Stocks>.Filter.Eq(s => s.Id, id);
        return await _collection.Find(filter).ToListAsync();
    }
}