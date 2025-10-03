using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace BackEnd.Models;

public class Stocks
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = String.Empty;
    [BsonElement("ingredient")]
    public string? Ingredient { get; set; }
    [BsonElement("unit")]
    public string? Unit { get; set; }
    [BsonElement("quantity")]
    public decimal Quantity { get; set; }
    [BsonElement("cost_per_unit")]
    public decimal CostPerUnit { get; set; }
    [BsonElement("total")]
    public decimal Total { get; set; }
    [BsonElement("supplier_id")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? SupplierId { get; set; }
    [BsonElement("add_stock_date")]
    public DateTime AddStockDate { get; set; }
    [BsonElement("image_url")]
    public string? ImageUrl { get; set; }
}