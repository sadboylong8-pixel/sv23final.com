using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace BackEnd.Models;

public class Staffs : Customers
{
    [BsonElement("position")]
    public string? Position { get; set; }
    [BsonElement("status")]
    public bool Status { get; set; }
    [BsonElement("start_date")]
    public DateTime StartDate { get; set; }
    [BsonElement("address")]
    public Addresses Address { get; set; } = new Addresses();
}
