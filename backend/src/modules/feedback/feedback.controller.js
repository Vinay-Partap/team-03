const Feedback=require("./feedback.model");
const Reply=require("./feedbackReply.model");
const { logAction }=require("../auditLogs/auditLogs.service");
const { deliver }=require("../../services/notification.service");
const feedbackService = require("./feedback.service");

const submitFeedback = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const feedback = await feedbackService.submitFeedback({
      ...req.body,
      userId,
    });

    await logAction({
      action: "FEEDBACK_SUBMIT",
      userId,
      userRole: req.user ? req.user.role : "guest",
      details: `Submitted contact/feedback: ${feedback.subject}`,
      targetId: feedback._id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(201).json({ success: true, message: "Feedback submitted successfully", feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyTickets=async(req,res)=>{try{res.json({success:true,tickets:await Feedback.find({userId:req.user.id}).sort({createdAt:-1})});}catch(e){res.status(500).json({success:false,message:e.message});}};

const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await feedbackService.getFeedbacks();
    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const resolveFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await feedbackService.resolveFeedback(id);

    await logAction({
      action: "FEEDBACK_RESOLVE",
      userId: req.user.id,
      userRole: req.user.role,
      details: `Resolved feedback item: ${feedback.subject}`,
      targetId: id,
      ipAddress: req.ip || "127.0.0.1",
    });

    res.status(200).json({ success: true, message: "Feedback marked as resolved", feedback });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateTicket=async(req,res)=>{try{const ticket=await Feedback.findById(req.params.id);if(!ticket)return res.status(404).json({success:false,message:"Ticket not found"});if(req.body.status)ticket.status=req.body.status;if(req.body.assignedTo){ticket.assignedTo=req.body.assignedTo;ticket.assignedAt=new Date();}if(req.body.resolutionNote)ticket.resolutionNote=req.body.resolutionNote;if(["resolved","closed"].includes(ticket.status)){ticket.resolvedBy=req.user.id;ticket.resolvedAt=new Date();}await ticket.save();if(ticket.userId)await deliver({userId:ticket.userId,title:"Support ticket updated",message:`Ticket ${ticket.ticketId} is now ${ticket.status}.`,type:"support_ticket",category:"system",link:"/feedback"});await logAction({action:req.body.assignedTo ? "SUPPORT_TICKET_ASSIGNED" : (["resolved","closed"].includes(ticket.status) ? "SUPPORT_TICKET_RESOLVED" : "SUPPORT_TICKET_STATUS_CHANGED"),userId:req.user._id,userRole:req.user.role,targetId:ticket._id,details:`Ticket ${ticket.ticketId} updated${req.body.assignedTo ? " assignment" : ""}`,ipAddress:req.ip});res.json({success:true,ticket});}catch(e){res.status(400).json({success:false,message:e.message});}};
const addReply=async(req,res)=>{try{const ticket=await Feedback.findById(req.params.id);if(!ticket)return res.status(404).json({success:false,message:"Ticket not found"});const reply=await Reply.create({ticketId:ticket._id,author:req.user.id,authorRole:req.user.role,message:req.body.message,internal:!!req.body.internal});ticket.lastResponseAt=new Date();await ticket.save();if(!reply.internal&&ticket.userId)await deliver({userId:ticket.userId,title:"Support reply received",message:`A reply was added to ${ticket.ticketId}.`,type:"support_ticket",category:"system",link:"/feedback"});await logAction({action:"SUPPORT_REPLY_ADDED",userId:req.user._id,userRole:req.user.role,targetId:ticket._id,details:`Reply added to ${ticket.ticketId}`,ipAddress:req.ip});res.status(201).json({success:true,reply});}catch(e){res.status(400).json({success:false,message:e.message});}};
const getReplies=async(req,res)=>{const ticket=await Feedback.findById(req.params.id);if(!ticket)return res.status(404).json({success:false,message:"Ticket not found"});if(req.user.role!=="admin"&&req.user.role!=="official"&&ticket.userId?.toString()!==req.user.id)return res.status(403).json({success:false,message:"Not authorized"});const query={ticketId:ticket._id,...((req.user.role==="admin"||req.user.role==="official")?{}:{internal:false})};res.json({success:true,replies:await Reply.find(query).populate("author","name role").sort({createdAt:1})});};

module.exports = {
  submitFeedback,
  getFeedbacks,
  getMyTickets,
  resolveFeedback,
  updateTicket,
  addReply,
  getReplies,
};
