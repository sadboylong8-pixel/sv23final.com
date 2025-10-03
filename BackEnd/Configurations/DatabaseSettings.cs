namespace BackEnd.Configurations;

public class DatabaseSettings
{
    public string ConnectionString { get; set; } = String.Empty;
    public string DatabaseName { get; set; } = String.Empty;
    public string CollectionProduct { get; set; } = String.Empty;
    public string CollectionStock { get; set; } = String.Empty;
    public string CollectionCustomer { get; set; } = String.Empty;
    public string CollectionSupplier { get; set; } = String.Empty;
    public string CollectionStaff { get; set; } = String.Empty;
    public string CollectionSale { get; set; } = String.Empty;
}