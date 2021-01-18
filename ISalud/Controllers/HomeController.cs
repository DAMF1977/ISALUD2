using ISalud.Clases;
using Newtonsoft.Json;
using RestSharp;
using System.Collections.Generic;
using System.Net;
using System.Web.Mvc;
using System.Web.Security;

namespace ISalud.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Ingresar(Login Info_Usuario)
        {
            RestClient Client = new RestClient(System.Configuration.ConfigurationManager.ConnectionStrings["webAPI"].ConnectionString);

            try
            {
                //Login
                string Json_Obj = JsonConvert.SerializeObject(Info_Usuario);
                RestRequest request_Auth = new RestRequest("api/login/authenticate", Method.POST, DataFormat.Json);
                request_Auth.AddParameter("application/json", Json_Obj, ParameterType.RequestBody);

                var Resp_Auth = Client.Post(request_Auth);
                if (Resp_Auth.StatusCode == HttpStatusCode.OK)
                {
                    Session["AUTH"] = Resp_Auth.Content.ToString().Replace(@"""", @"");


                    //PreferenciasUsuario pref = new PreferenciasUsuario
                    //{
                    //    PRU_DOMINIO = Info_Usuario.DOMINIO,
                    //    PRU_USUARIO_ID = Info_Usuario.USUARIO
                    //};


                    ////Preferencias de usuario
                    //Json_Obj = JsonConvert.SerializeObject(pref);
                    //RestRequest request_Pref = new RestRequest("api/MostrarPreferenciaUsuarios", Method.POST, DataFormat.Json);
                    //request_Pref.AddHeader("Authorization", Session["AUTH"].ToString());
                    //request_Pref.AddParameter("application/json", Json_Obj, ParameterType.RequestBody);

                    //List<PreferenciasUsuario> Resp_Pref = Client.Post<List<PreferenciasUsuario>>(request_Pref).Data;
                    //if (Resp_Pref == null || Resp_Pref.Count == 0)
                    //{
                    //    ContentResult resp = Content("Usuario no existe en tabla Preferencias de Usuario");
                    //    HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    //    return resp;

                    //}
                    FormsAuthentication.SetAuthCookie(Info_Usuario.Usuario, true);
                    Session["USUARIO"] = Info_Usuario.Usuario.ToUpper();
                    return Json(new { aaData = "" }, JsonRequestBehavior.AllowGet);
                    //return Json(Url.Action("Index", "Home"));
                }
                else
                {
                    ContentResult resp = Content("Usuario, Credenciales invalidas");
                    HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return resp;
                }
            }
            catch
            {
                ContentResult resp = Content("Usuario, Credenciales invalidas");
                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return resp;
            }
        }

    }
}