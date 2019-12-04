using Microsoft.AspNetCore.Mvc;
using CellarerWeb.Models;
using System.Net.Http;
using System.Threading.Tasks;

namespace CellarerWeb.Controllers
{
    public class FakeApiController : Controller
    {
        [Route("/fakeapi/login")]
        [HttpPost]
        public JsonResult Login([FromBody]LoginInput input) {
            return Json(new { Token = "This is a fake token for testing" });
        }

        [Route("/fakeapi/liquor/categories")]
        public JsonResult GetLiquorCategories([FromHeader]string authToken, string id) {
            return Json(new object[] {
                new {
                    Id = "1",
                    Name = "Beer"
                },
                new {
                    Id = "2",
                    Name = "Whiskey"
                },
                new {
                    Id = "3",
                    Name = "Tequila"
                }
            });
        }

        [Route("/fakeapi/liquors")]
        public JsonResult GetLiquors([FromHeader]string AUTH_TOKEN, string id) {
            var result = new object[] {
                new {
                    Id = "1",
                    Name = "Beer A",
                    Category = "Beer",
                    Brand = "Brand A",
                    Origin = "Germany",
                    Url = "http://www.my9.com.tw/image/product/pro_927521302d2715babe0dcc8ee5d1935f.png"
                },
                new {
                    Id="2",
                    Name = "Beer B",
                    Category = "Beer",
                    Brand = "Brand B",
                    Origin = "Japan",
                    Url = "http://www.my9.com.tw/image/product/pro_f37281f740f73719362f0937fee13b71.jpg"
                }, 
                new {
                    Id="3",
                    Name = "Whiskey A",
                    Category = "Whiskey",
                    Brand = "Brand C",
                    Origin = "Scotland",
                    Url = "http://www.my9.com.tw/image/product/pro_cbb684095c8a43e99398b1af7da733da.jpg"
                }, 
                new {
                    Id="4",
                    Name = "Tequila",
                    Category = "Tequila",
                    Brand = "Brand B",
                    Origin = "Mexico",
                    Url = "http://www.my9.com.tw/image/product/pro_0fa36aac4d8bb3de1ae907c28b8d4b33.png"
                }, 
                new {
                    Id="5",
                    Name = "Gin",
                    Category = "Tequila",
                    Brand = "Brand C",
                    Origin = "England",
                    Url = "http://www.my9.com.tw/image/product/pro_41320a8dc063cb783715b87ce722c9a6.png"
                }
            };

            return Json(result);
        }

        [Route("/fakeapi/menu/{id}/save")]
        [HttpPost]
        public JsonResult MenuSave([FromHeader]string AUTH_TOKEN, string id) {
            return Json(new { Status = 0 });
        }

        [Route("/fakeapi/menu/{id}/categories")]
        public JsonResult GetMenuItemCategories([FromHeader]string authToken, string id) {
            return Json(new object[] {
                new {
                    Id = "1",
                    Name = "Beer"
                },
                new {
                    Id = "2",
                    Name = "Whiskey"
                }
            });
        }

        [Route("/fakeapi/menu/{id}")]
        public JsonResult GetMenuItems([FromHeader]string AUTH_TOKEN, string id) {
            var result = new object[] {
                new {
                    Id = "1",
                    LiquorId = "78",
                    Name = "Beer 78",
                    Category = "Beer",
                    Brand = "Brand A",
                    Price = 99,
                    Origin = "Germany",
                    Description = "Tastes so so but light and cheap",
                    Url = "http://www.my9.com.tw/image/product/pro_927521302d2715babe0dcc8ee5d1935f.png"
                },
                new {
                    Id = "2",
                    LiquorId = "87",
                    Name = "Beer 87",
                    Category = "Beer",
                    Brand = "Brand B",
                    Price = 82,
                    Origin = "Japan",
                    Description = "Tastes so so but light and cheap",
                    Url = "http://www.my9.com.tw/image/product/pro_f37281f740f73719362f0937fee13b71.jpg"
                }
            };

            return Json(result);
        }
    }
}