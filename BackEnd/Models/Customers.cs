using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace BackEnd.Models;

public class Customers
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = String.Empty;
    [BsonElement("name")]
    public string? Name { get; set; }
    [BsonElement("gender")]
    public string? Gender { get; set; }
    [BsonElement("image_url")]
    public string? ImageUrl { get; set; }
    [BsonElement("contact")]
    public Contacts Contact { get; set; } = new Contacts();
}


public class Contacts
{
    [BsonElement("phone_number")]
    public string PhoneNumber { get; set; } = String.Empty;
    [BsonElement("email")]
    public string Email { get; set; } = String.Empty;
}