using BackEnd.Configurations;
using BackEnd.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Text.Json.Nodes;

namespace BackEnd.Services;

public class SaleService
{
    private readonly IMongoCollection<Sales> _collection;
    private readonly IMongoCollection<Products> _product;
    private readonly IMongoCollection<Customers> _customer;
    private readonly IMongoCollection<Staffs> _staff;
    public SaleService(IOptions<DatabaseSettings> databaseSetting)
    {
        // initialize the mongo client
        var client = new MongoClient(databaseSetting.Value.ConnectionString);
        // connect to the monogo Database
        var database = client.GetDatabase(databaseSetting.Value.DatabaseName);
        // connect to the collection
        _collection = database.GetCollection<Sales>(databaseSetting.Value.CollectionSale);
        _product = database.GetCollection<Products>(databaseSetting.Value.CollectionProduct);
        _customer = database.GetCollection<Customers>(databaseSetting.Value.CollectionCustomer);
        _staff = database.GetCollection<Staffs>(databaseSetting.Value.CollectionStaff);
    }

    public async Task<List<Sales>> GetAllAsync()
    {
        return await _collection.Find(_ => true).ToListAsync();
//         var pipeline = new[]
// {
//     new BsonDocument("$lookup", new BsonDocument
//     {
//         { "from", "Customers" },
//         { "localField", "customer_id" },
//         { "foreignField", "_id" },
//         { "as", "CustomerInfo" }
//     }),
//     new BsonDocument("$lookup", new BsonDocument
//     {
//         { "from", "Staffs" },
//         { "localField", "staff_id" },
//         { "foreignField", "_id" },
//         { "as", "StaffInfo" }
//     }),
//     new BsonDocument("$unwind", "$orders"),
//     new BsonDocument("$lookup", new BsonDocument
//     {
//         { "from", "Products" },
//         { "localField", "orders.product_id" },   // notice the dot syntax
//         { "foreignField", "_id" },
//         { "as", "ProductInfo" }
//     })
//     // ... group back as shown in the previous answer
// };

//         var result = await _collection.Aggregate<SaleDetails>(pipeline).ToListAsync();
//         return result;

    }

    public async Task<string> CreateAsync([FromBody] Sales sale)
    {
        await _collection.InsertOneAsync(sale);
        return sale.Id;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var filter = Builders<Sales>.Filter.Eq(p => p.Id, id);
        var result = await _collection.DeleteOneAsync(filter);
        return result.DeletedCount == 1;
    }

    public async Task<bool> UpdateAsync(string id, Sales sale)
    {
        var filter = Builders<Sales>.Filter.Eq(p => p.Id, id);
        var update = Builders<Sales>.Update
            .Set(p => p.CustomerId, sale.CustomerId)
            .Set(p => p.StaffId, sale.StaffId)
            .Set(p => p.SaleDate, sale.SaleDate)
            .Set(p => p.Total, sale.Total)
            .Set(p => p.Orders, sale.Orders);
        var result = await _collection.UpdateOneAsync(filter, update);
        return result.ModifiedCount == 1;
    }

    public async Task<List<Sales>> GetOneAsync(string id)
    {
        var filter = Builders<Sales>.Filter.Eq(p => p.Id, id);
        return await _collection.Find(filter).ToListAsync();
    }
}