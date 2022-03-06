const searchFoodAdapterData = (data) => ({
    totalPages: data.totalPages,
    currentPage: data.currentPage,
    foods: data.foods.map(food => ({
      id: food.fdcId,
      dataType: food.dataType,
      publishedDate: food.publishedDate,
      description: food.description,
      foodCategory: food.foodCategory,
      brandOwner: food.brandOwner,
      marketCountry: food.marketCountry
    }))
})

module.exports = { searchFoodAdapterData }