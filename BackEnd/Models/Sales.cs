using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace BackEnd.Models;

public class Sales
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = String.Empty;
    [BsonElement("customer_id")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? CustomerId { get; set; }
    [BsonElement("staff_id")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? StaffId { get; set; }
    [BsonElement("sale_date")]
    public DateTime SaleDate { get; set; }
    [BsonElement("total")]
    public decimal Total { get; set; }
    [BsonElement("orders")]
    public List<ProductOrder> Orders { get; set; } = new List<ProductOrder>();
}

public class ProductOrder
{
    [BsonElement("product_id")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? ProductId { get; set; }
    [BsonElement("quantity")]
    public decimal Quantity { get; set; }
}

// public class ProductOrderDetail
// {
//     [BsonElement("ProductInfo")]
//     public Products ProduuctInfo { get; set; } = new Products();
//     [BsonElement("quantity")]
//     public decimal Quantity { get; set; }
// }

// public class SaleDetails
// {
//     [BsonId]
//     [BsonRepresentation(BsonType.ObjectId)]
//     public string Id { get; set; } = String.Empty;
//     [BsonElement("customer_id")]
//     [BsonRepresentation(BsonType.ObjectId)]
//     public string? CustomerId { get; set; }
//     [BsonElement("staff_id")]
//     [BsonRepresentation(BsonType.ObjectId)]
//     public string? StaffId { get; set; }
//     [BsonElement("sale_date")]
//     public DateTime SaleDate { get; set; }
//     [BsonElement("total")]
//     public decimal Total { get; set; }
//     [BsonElement("orders")]
//     public List<ProductOrder> Orders { get; set; } = new List<ProductOrder>();
//     public Customers CustomerInfo { get; set; } = new Customers();
//     public Staffs StaffInfo { get; set; } = new Staffs();
//     public List<ProductOrderDetail> OrderInfo { get; set; } = new List<ProductOrderDetail>();
// }
