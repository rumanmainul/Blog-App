using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using BlogSiteApp.Models;
using BlogSiteApp.Models.ViewModel;

namespace BlogSiteApp.Controllers
{
    public class PostController : Controller
    {
        UserDBGateway db = new UserDBGateway();

        // GET: Post
        public ActionResult Index()
        {
                ViewData["Allpost"] = GetAllPost();
                ViewData["MostViewList"] = GetMostViewPosts();
                return View();
        }

        public JsonResult GetPostInfo(string srcstr)
        {
            var products = from m in db.Posts
                           join n in db.Users on m.UserId equals n.UserId
                           where (m.IsPublished == true && m.Title.Contains(srcstr) || m.Description.Contains(srcstr) || m.User.UserName.Contains(srcstr))
                           orderby m.NoOfView descending
                           select (new PostView() { PostId = m.PostId, PostTitle = m.Title, PostDescription = m.Description, PostDate = m.PostedDate.ToString(), AuthorId = m.User.UserId.ToString(), AuthorName = m.User.UserName });
            if (products != null)
            {
                return Json(products, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(false, JsonRequestBehavior.AllowGet);
            }
            
        }

        public ActionResult Comment()
        {
            return View();
        }

        public List<PostView> GetMostViewPosts()
        {
            var aPosts = new List<PostView>();
            var v = from m in db.Posts
                    join n in db.Users on m.UserId equals n.UserId
                    where (m.IsPublished == true)
                    orderby m.NoOfView descending
                    select (new PostView() { PostId = m.PostId, PostTitle = m.Title, PostDescription = m.Description, PostDate = m.PostedDate.ToString(), AuthorId = m.User.UserId.ToString(), AuthorName = m.User.UserName });
            aPosts = v.ToList();
            return aPosts;
        }

        public List<PostView> GetAllPost()
        {
            List<PostView> aPostList = new List<PostView>();
            var v = from m in db.Posts 
                    join n in db.Users on m.UserId equals n.UserId where (m.IsPublished==true) orderby m.PostedDate descending 
                    select(new PostView() { PostId = m.PostId, PostTitle = m.Title, PostDescription = m.Description, PostDate = m.PostedDate.ToString(), AuthorId = m.User.UserId.ToString(), AuthorName = m.User.UserName });
            aPostList = v.ToList();
            return aPostList;
        }

        public ActionResult Details(int? id, int? userid)
        {
            var update = db.Posts.Single(c => c.PostId == id);
            update.NoOfView += 1;
            db.SaveChanges();
            ViewData["GetThePost"] = GetThePost(id);
            ViewData["PostComment"] = GetPostComment(id);
            ViewData["UserOtherPost"] = GetUserOtherPost(userid);
            return View();
        }

        private List<PostView> GetUserOtherPost(int? userid)
        {
            List<PostView> aPostList = new List<PostView>();
            var v = from m in db.Posts
                    join n in db.Users on m.UserId equals n.UserId
                    where (m.IsPublished == true && m.UserId==userid)
                    orderby m.PostedDate descending
                    select (new PostView() { PostId = m.PostId, PostTitle = m.Title, PostDescription = m.Description, PostDate = m.PostedDate.ToString(), AuthorId = m.User.UserId.ToString(), AuthorName = m.User.UserName });
            aPostList = v.ToList();
            return aPostList;
        }

        private List<CommentView> GetPostComment(int? id)
        {
            List<CommentView> CommentsList = new List<CommentView>();
            var v = from m in db.Comments 
                    join n in db.Users on m.UserId equals n.UserId where (m.PostId==id && m.IsDeleted==true)
                    select(new CommentView() { PosterName = m.User.UserName, PosterId = m.User.UserId, CommentDescription = m.Description, CommentId = m.CommentId, CommentDate = m.CommentDate.ToString()});
            CommentsList = v.ToList();
            return CommentsList;
        }

        private List<PostView> GetThePost(int? id)
        {
            var aPosts = new List<PostView>();
            var v = from m in db.Posts
                    join n in db.Users on m.UserId equals n.UserId
                    where (m.IsPublished == true && m.PostId==id)
                    orderby m.NoOfView descending
                    select (new PostView() { PostId = m.PostId, PostTitle = m.Title, PostDescription = m.Description, PostDate = m.PostedDate.ToString(), AuthorId = m.User.UserId.ToString(), AuthorName = m.User.UserName });
            aPosts = v.ToList();
            return aPosts;
        }

        public JsonResult SaveComment(string comments, int postId, int userid)
        {
            Comment aComment = new Comment()
            {
                Description = comments,
                CommentDate = DateTime.Now,
                IsDeleted = true,
                PostId = postId,
                UserId = userid
            };
            db.Comments.Add(aComment);
            db.SaveChanges();
            return Json(true, JsonRequestBehavior.AllowGet);
        }

        public ActionResult CreatePost()
        {
            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult CreatePost([Bind(Include = "Title,Description, UserId")] Post aPost, string Submit)
        {
            if (Session["UserId"] == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            if (aPost != null)
            {
                switch (Submit)
                {
                    case "Save":
                        if (ModelState.IsValid)
                        {
                            aPost.Description = aPost.Description;
                            aPost.NoOfView = 0;
                            aPost.PostedDate = DateTime.Now;
                            aPost.IsPublished = false;
                            db.Posts.Add(aPost);
                            db.SaveChanges();
                            ViewBag.SuccessAlert = "Succesfully save";
                            return View();
                        }
                        break;
                    case "SaveAndPublish":
                        if (ModelState.IsValid)
                        {
                            aPost.Description = aPost.Description;
                            aPost.NoOfView = 0;
                            aPost.PostedDate = DateTime.Now;
                            aPost.IsPublished = true;
                            db.Posts.Add(aPost);
                            db.SaveChanges();
                            ViewBag.SuccessAlert = "Succesfully save and publish";
                            return View();
                        }
                        break;

                }
            }
            ViewBag.ErrorAlert = "Post Not Saved";
            return View();
        }

        public ActionResult UserArticleList()
        {
            if (Session["UserId"] == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            int userId = Convert.ToInt32(Session["UserId"]);
            ViewData["PublishedPost"] = GetPublishedPost(userId);
            ViewData["NonPublishedPost"] = GetNonPublishedPost(userId);
            return View();
        }

        private List<Post> GetNonPublishedPost(int userId)
        {
            List<Post> aPostList = new List<Post>();
            var posts = from m in db.Posts where m.UserId == userId && m.IsPublished == false select m;
            aPostList = posts.ToList();
            return aPostList;

        }

        private List<Post> GetPublishedPost(int userId)
        {
            List<Post> aPostList = new List<Post>();
            var posts = from m in db.Posts where m.UserId == userId && m.IsPublished == true select m;
            aPostList = posts.ToList();
            return aPostList;
        }

        public ActionResult Publish(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Post post = db.Posts.Find(id);
            if (post == null)
            {
                return HttpNotFound();
            }
            ViewBag.UserId = new SelectList(db.Users, "UserId", "UserName", post.UserId);
            return View(post);

        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Publish([Bind(Include = "PostId,Title,Description,PostedDate,IsPublished,NoOfView,UserId")] Post post)
        {
            if (ModelState.IsValid)
            {
                int uId = Convert.ToInt32(Session["UserId"]);
                post.UserId = uId;
                post.PostedDate = DateTime.Now;
                post.IsPublished = true;
                db.Entry(post).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.UserId = new SelectList(db.Users, "UserId", "UserName", post.UserId);
            return View(post);
        }
    }
}