using BackEnd.Configurations;
using BackEnd.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace BackEnd.Services;

public class SupplierService
{
    private readonly IMongoCollection<Suppliers> _collection;
    public SupplierService(IOptions<DatabaseSettings> databaseSetting)
    {
        // initialize the mongo client
        var client = new MongoClient(databaseSetting.Value.ConnectionString);
        // connect to the monogo Database
        var database = client.GetDatabase(databaseSetting.Value.DatabaseName);
        // connect to the collection
        _collection = database.GetCollection<Suppliers>(databaseSetting.Value.CollectionSupplier);
    }

    public async Task<List<Suppliers>> GetAllAsync()
    {
        return await _collection.Find(_ => true).ToListAsync();
    }

    public async Task<string> CreateAsync([FromBody] Suppliers supplier)
    {
        await _collection.InsertOneAsync(supplier);
        return supplier.Id;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var filter = Builders<Suppliers>.Filter.Eq(p => p.Id, id);
        var result = await _collection.DeleteOneAsync(filter);
        return result.DeletedCount == 1;
    }

    public async Task<bool> UpdateAsync(string id, Suppliers supplier)
    {
        var filter = Builders<Suppliers>.Filter.Eq(p => p.Id, id);
        var update = Builders<Suppliers>.Update
            .Set(p => p.Name, supplier.Name)
            .Set(p => p.Contact.PhoneNumber, supplier.Contact.PhoneNumber)
            .Set(p => p.Contact.Email, supplier.Contact.Email)
            .Set(p => p.Address.Street, supplier.Address.Street)
            .Set(p => p.Address.District, supplier.Address.District)
            .Set(p => p.Address.City, supplier.Address.City);
        var result = await _collection.UpdateOneAsync(filter, update);
        return result.ModifiedCount == 1;
    }

    public async Task<List<Suppliers>> GetOneAsync(string id)
    {
        var filter = Builders<Suppliers>.Filter.Eq(p => p.Id, id);
        return await _collection.Find(filter).ToListAsync();
    }
}