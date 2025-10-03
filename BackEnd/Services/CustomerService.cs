using BackEnd.Configurations;
using BackEnd.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace BackEnd.Services;

public class CustomerService
{
    private readonly IMongoCollection<Customers> _collection;
    public CustomerService(IOptions<DatabaseSettings> databaseSetting)
    {
        // initialize the mongo client
        var client = new MongoClient(databaseSetting.Value.ConnectionString);
        // connect to the monogo Database
        var database = client.GetDatabase(databaseSetting.Value.DatabaseName);
        // connect to the collection
        _collection = database.GetCollection<Customers>(databaseSetting.Value.CollectionCustomer);
    }

    public async Task<List<Customers>> GetAllAsync()
    {
        return await _collection.Find(_ => true).ToListAsync();
    }

    public async Task<string> CreateAsync([FromBody] Customers customer)
    {
        await _collection.InsertOneAsync(customer);
        return customer.Id;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var filter = Builders<Customers>.Filter.Eq(p => p.Id, id);
        var result = await _collection.DeleteOneAsync(filter);
        return result.DeletedCount == 1;
    }

    public async Task<bool> UpdateAsync(string id, Customers customer)
    {
        var filter = Builders<Customers>.Filter.Eq(p => p.Id, id);
        var update = Builders<Customers>.Update
            .Set(p => p.Name, customer.Name)
            .Set(p => p.Gender, customer.Gender)
            .Set(p => p.ImageUrl, customer.ImageUrl)
            .Set(p => p.Contact.PhoneNumber, customer.Contact.PhoneNumber)
            .Set(p => p.Contact.Email, customer.Contact.Email);
        var result = await _collection.UpdateOneAsync(filter, update);
        return result.ModifiedCount == 1;
    }

    public async Task<List<Customers>> GetOneAsync(string id)
    {
        var filter = Builders<Customers>.Filter.Eq(p => p.Id, id);
        return await _collection.Find(filter).ToListAsync();
    }
}