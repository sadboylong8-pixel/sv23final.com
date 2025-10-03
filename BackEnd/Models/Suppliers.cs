using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace BackEnd.Models;

public class Suppliers
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = String.Empty;
    [BsonElement("name")]
    public string? Name { get; set; }
    [BsonElement("contact")]
    public Contacts Contact { get; set; } = new Contacts();
    [BsonElement("address")]
    public Addresses Address { get; set; } = new Addresses();
}


public class Addresses {
    [BsonElement("street")]
    public string? Street { get; set; }
    [BsonElement("district")]
    public string? District { get; set; }
    [BsonElement("city")]
    public string? City { get; set; }
}