"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { LoadingButton } from "@/components/ui/loading-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import SuccessModal from "@/components/ui/success-modal"
import { Phone, Mail, MapPin } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export default function ContactSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const { t, isRTL } = useLanguage()
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' })
    setIsSubmitting(false)
    setShowSuccessModal(true)
  }

  // Check for URL parameters to auto-fill subject field
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkUrlParams = () => {
        const urlParams = new URLSearchParams(window.location.search)
        const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || '')
        const subjectParam = urlParams.get('subject') || hashParams.get('subject')
        
        if (subjectParam) {
          setFormData(prev => ({ ...prev, subject: decodeURIComponent(subjectParam) }))
          
          // Scroll to contact form smoothly with a small delay
          setTimeout(() => {
            const contactElement = document.getElementById('contact')
            if (contactElement) {
              contactElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }, 100)
        }
      }

      // Check immediately
      checkUrlParams()
      
      // Also check when hash changes
      const handleHashChange = () => checkUrlParams()
      window.addEventListener('hashchange', handleHashChange)
      
      return () => window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <section id="contact" ref={ref} className="bg-black py-24 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
            {t.home.contactTitle.split("Us").map((part, index) => (
              <span key={index}>
                {part}
                {index === 0 && <span className="text-gold">Us</span>}
              </span>
            ))}
          </h2>
          <p className="mx-auto max-w-2xl text-white/70">{t.home.contactSubtitle}</p>
        </motion.div>

        <div className="grid gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="mb-6 text-2xl font-bold text-white">Get in Touch</h3>
            <form className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm text-white/70">
                    {t.auth.firstName}
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm text-white/70">
                    {t.auth.email}
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="mb-2 block text-sm text-white/70">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="How can we help you?"
                  className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm text-white/70">
                  {t.carDetails.message}
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your message..."
                  rows={5}
                  className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500"
                />
              </div>
              <LoadingButton 
                className="w-full bg-gold hover:bg-gold/90 text-black"
                onClick={handleSubmit}
                loading={isSubmitting}
                loadingText="Sending message..."
                loadingDelay={300}
                disabled={!formData.name || !formData.email || !formData.message}
              >
                {t.carDetails.sendMessage}
              </LoadingButton>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col justify-between"
          >
            <div>
              <h3 className="mb-6 text-2xl font-bold text-white">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className={`h-6 w-6 text-gold ${isRTL ? "ml-4" : "mr-4"}`} />
                  <div>
                    <h4 className="font-medium text-white">Visit Our Showroom</h4>
                    <p className="text-white/70">
                      Mint Luxe Auto Showroom
                      <br />
                      Morocco, Casablanca
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className={`h-6 w-6 text-gold ${isRTL ? "ml-4" : "mr-4"}`} />
                  <div>
                    <h4 className="font-medium text-white">Call Us</h4>
                    <p className="text-white/70">+212 691 560 484</p>
                    <p className="text-white/70">Mon-Fri: 9AM - 8PM, Sat: 10AM - 6PM</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className={`h-6 w-6 text-gold ${isRTL ? "ml-4" : "mr-4"}`} />
                  <div>
                    <h4 className="font-medium text-white">Email Us</h4>
                    <p className="text-white/70">aminemanssouri100@gmail.com</p>
                    <p className="text-white/70">Contact: Amine Manssouri</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 rounded-lg bg-zinc-800/30 p-6">
              <h4 className="mb-4 text-lg font-medium text-white">VIP Appointments</h4>
              <p className="mb-4 text-white/70">
                Schedule a private viewing of our exclusive collection with our luxury automotive specialists.
              </p>
              <LoadingButton 
                variant="outline" 
                className="border-gold text-gold hover:bg-gold/10"
                onClick={async () => {
                  await new Promise(resolve => setTimeout(resolve, 800))
                  window.location.href = '/appointment'
                }}
                loading={false}
                loadingText="Loading..."
                loadingDelay={200}
              >
                Book Private Appointment
              </LoadingButton>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Message Sent Successfully!"
        message="Thank you for contacting Mint Luxe Auto. Amine Manssouri will get back to you within 24 hours."
        actionText="Browse Collection"
        onAction={() => window.location.href = '/collection'}
      />
    </section>
  )
}
