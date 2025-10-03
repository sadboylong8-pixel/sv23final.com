using BackEnd.Configurations;
using BackEnd.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace BackEnd.Services;

public class StaffService
{
    private readonly IMongoCollection<Staffs> _collection;
    public StaffService(IOptions<DatabaseSettings> databaseSetting)
    {
        // initialize the mongo client
        var client = new MongoClient(databaseSetting.Value.ConnectionString);
        // connect to the monogo Database
        var database = client.GetDatabase(databaseSetting.Value.DatabaseName);
        // connect to the collection
        _collection = database.GetCollection<Staffs>(databaseSetting.Value.CollectionStaff);
    }

    public async Task<List<Staffs>> GetAllAsync()
    {
        return await _collection.Find(_ => true).ToListAsync();
    }

    public async Task<string> CreateAsync([FromBody] Staffs staff)
    {
        await _collection.InsertOneAsync(staff);
        return staff.Id;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var filter = Builders<Staffs>.Filter.Eq(p => p.Id, id);
        var result = await _collection.DeleteOneAsync(filter);
        return result.DeletedCount == 1;
    }

    public async Task<bool> UpdateAsync(string id, Staffs staff)
    {
        var filter = Builders<Staffs>.Filter.Eq(p => p.Id, id);
        var update = Builders<Staffs>.Update
            .Set(p => p.Name, staff.Name)
            .Set(p => p.Gender, staff.Gender)
            .Set(p => p.ImageUrl, staff.ImageUrl)
            .Set(p => p.Contact.PhoneNumber, staff.Contact.PhoneNumber)
            .Set(p => p.Contact.Email, staff.Contact.Email)
            .Set(p => p.Address.Street, staff.Address.Street)
            .Set(p => p.Address.District, staff.Address.District)
            .Set(p => p.Address.City, staff.Address.City);
        var result = await _collection.UpdateOneAsync(filter, update);
        return result.ModifiedCount == 1;
    }

    public async Task<List<Staffs>> GetOneAsync(string id)
    {
        var filter = Builders<Staffs>.Filter.Eq(p => p.Id, id);
        return await _collection.Find(filter).ToListAsync();
    }
}