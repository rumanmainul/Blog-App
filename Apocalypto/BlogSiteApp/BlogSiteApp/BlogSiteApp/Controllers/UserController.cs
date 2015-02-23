using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using BlogSiteApp.Models;

namespace BlogSiteApp.Controllers
{
    public class UserController : Controller
    {
        UserDBGateway db = new UserDBGateway();
        // GET: User
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Index([Bind(Include = "UserId,UserName,Password,ConfirmPassword,Email")] User aRegisterViewModel)
        {
            if (ModelState.IsValid)
            {
                if (hasEmail(aRegisterViewModel.Email))
                {
                    //return RedirectToAction("Index/1", "User");
                    ViewBag.ErrorAlert = "Email is already used";
                    ViewBag.ErrorAlert = "Email is already used";
                    return View();
                }
                else
                {
                    db.Users.Add(aRegisterViewModel);
                    db.SaveChanges();
                    ViewBag.SuccessAlert = "You have successfully registered.";
                    return View();
                }   
            }
            return View(aRegisterViewModel);
        }

        private bool hasEmail(string Email)
        {
            string searchEmail = Email;
            var userEmail = from m in db.Users select m;
            userEmail = userEmail.Where(s => s.Email.Contains(searchEmail));
            int i = userEmail.Count();
            if (i > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public ActionResult Confirm()
        {
            ViewBag.Confirmtext = "User Registration SuccessFull";
            return View();
        }

        public ActionResult Login()
        {
            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LoginCheck(User aUser)
        {

            var v = db.Users.Where(a => a.Email.Equals(aUser.Email) && a.Password.Equals(aUser.Password)).FirstOrDefault();
            //var v = from user in db.RegisterViewModels where user.Email == aRegisterViewModel.Email && user.Password==aRegisterViewModel.Password select new{user.Id, user.Email};
            if (v != null)
            {
                Session["UserId"] = v.UserId.ToString();
                Session["Username"] = v.UserName;
                return Redirect("Comment");
            }

            return Redirect("Login");
        }

        public ActionResult Comment()
        {
            return View();
        }



        public JsonResult LoginUser(string username, string password)
        {
            var v = db.Users.FirstOrDefault(m => m.Email == username && m.Password == password);
           
            if (v!=null)
            {
                Session["UserId"] = v.UserId.ToString();
                Session["Username"] = v.UserName;
                return Json(true, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(false, JsonRequestBehavior.AllowGet);  
            }
        }

        public ActionResult Logout()
        {
            Session.Clear();
            return RedirectToAction("Index", "Post");
        }

    }
}