using BackEnd.Configurations;
using BackEnd.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace BackEnd.Services;

public class ProductService
{
    private readonly IMongoCollection<Products> _collection;
    public ProductService(IOptions<DatabaseSettings> databaseSetting)
    {
        // initialize the mongo client
        var client = new MongoClient(databaseSetting.Value.ConnectionString);
        // connect to the monogo Database
        var database = client.GetDatabase(databaseSetting.Value.DatabaseName);
        // connect to the collection
        _collection = database.GetCollection<Products>(databaseSetting.Value.CollectionProduct);
    }

    public async Task<List<Products>> GetAllAsync()
    {
        return await _collection.Find(_ => true).ToListAsync();
    }

    public async Task<string> CreateAsync([FromBody] Products product)
    {
        await _collection.InsertOneAsync(product);
        return product.Id;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var filter = Builders<Products>.Filter.Eq(p => p.Id, id);
        var result = await _collection.DeleteOneAsync(filter);
        return result.DeletedCount == 1;
    }

    public async Task<bool> UpdateAsync(string id, Products product)
    {
        var filter = Builders<Products>.Filter.Eq(p => p.Id, id);
        var update = Builders<Products>.Update
            .Set(p => p.Name, product.Name)
            .Set(p => p.Barcode, product.Barcode)
            .Set(p => p.Category, product.Category)
            .Set(p => p.ImageUrl, product.ImageUrl)
            .Set(p => p.SellPrice, product.SellPrice)
            .Set(p => p.Status, product.Status)
            .Set(p => p.Ingredients, product.Ingredients);
        var result = await _collection.UpdateOneAsync(filter, update);
        return result.ModifiedCount == 1;
    }

    public async Task<List<Products>> GetOneAsync(string id)
    {
        var filter = Builders<Products>.Filter.Eq(p => p.Id, id);
        return await _collection.Find(filter).ToListAsync();
    }
}