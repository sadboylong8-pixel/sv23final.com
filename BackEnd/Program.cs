using BackEnd.Configurations;
using BackEnd.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<DatabaseSettings>(builder.Configuration.GetSection("MongoDatabase"));

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add singleton
builder.Services.AddSingleton<ProductService>();
builder.Services.AddSingleton<StockService>();
builder.Services.AddSingleton<CustomerService>();
builder.Services.AddSingleton<SaleService>();
builder.Services.AddSingleton<StaffService>();
builder.Services.AddSingleton<SupplierService>();

// add CORS policy
builder.Services.AddCors(options => options
.AddPolicy("AngularClient", policy =>
{
    policy.WithOrigins("http://localhost:4200")
          .AllowAnyHeader()
          .AllowAnyMethod();
}));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AngularClient");

app.UseAuthorization();

app.MapControllers();

app.Run();
