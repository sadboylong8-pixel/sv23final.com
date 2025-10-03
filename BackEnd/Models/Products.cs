using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace BackEnd.Models;

public class Products
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = String.Empty;
    [BsonElement("name")]
    public string? Name { get; set; }
    [BsonElement("barcode")]
    public string? Barcode { get; set; }
    [BsonElement("category")]
    public string? Category { get; set; }
    [BsonElement("image_url")]
    public string? ImageUrl { get; set; }
    [BsonElement("sell_price")]
    public decimal SellPrice { get; set; }
    [BsonElement("status")]
    public bool Status { get; set; }
    [BsonElement("ingredients")]
    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> Ingredients { get; set; } = new List<string>();
}