'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Import icons individually to avoid bundling conflicts
import { MapPin } from "lucide-react"
import { Phone } from "lucide-react"
import { Mail } from "lucide-react"
import { Users } from "lucide-react"
import { Linkedin } from "lucide-react"
import { Upload } from "lucide-react"
import { X } from "lucide-react"

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    category: '',
    message: ''
  })
  
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    // Basic validation
    if (!formData.name.trim()) {
      setSubmitMessage('Please enter your name.')
      setIsSubmitting(false)
      return
    }
    if (!formData.company.trim()) {
      setSubmitMessage('Please enter your company name.')
      setIsSubmitting(false)
      return
    }
    if (!formData.email.trim()) {
      setSubmitMessage('Please enter your email.')
      setIsSubmitting(false)
      return
    }
    if (!formData.phone.trim()) {
      setSubmitMessage('Please enter your phone number.')
      setIsSubmitting(false)
      return
    }
    if (!formData.category) {
      setSubmitMessage('Please select a service category.')
      setIsSubmitting(false)
      return
    }
    if (!formData.message.trim()) {
      setSubmitMessage('Please enter your message.')
      setIsSubmitting(false)
      return
    }

    try {
      console.log('Submitting form with data:', formData);
      console.log('Files to upload:', uploadedFiles.length);
      
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name.trim())
      formDataToSend.append('company', formData.company.trim())
      formDataToSend.append('email', formData.email.trim())
      formDataToSend.append('phone', formData.phone.trim())
      formDataToSend.append('category', formData.category)
      formDataToSend.append('requirements', formData.message.trim())
      formDataToSend.append('recaptchaToken', 'bypass')
      
      // Append multiple files
      uploadedFiles.forEach((file, index) => {
        formDataToSend.append(`file${index}`, file)
        console.log(`Appending file ${index}:`, file.name, file.size, 'bytes')
      })

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        setSubmitMessage('Thank you! Your message has been sent successfully.')
        // Reset form
        setFormData({
          name: '',
          company: '',
          email: '',
          phone: '',
          category: '',
          message: ''
        })
        setUploadedFiles([])
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Form submission error:', errorData)
        setSubmitMessage(`Sorry, there was an error: ${errorData.error || 'Please try again.'}`)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitMessage('Sorry, there was an error sending your message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      // Limit to 5 files total
      const newFiles = [...uploadedFiles, ...files].slice(0, 5)
      setUploadedFiles(newFiles)
    }
    // Reset the input value to allow re-selecting the same file
    e.target.value = ''
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-emuski-teal-darker">
            We'd love to work with you!
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Submit the form below and our representative will be in touch shortly.
          </p>
        </div>

        {/* Main Layout */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-5xl mx-auto">
          {/* Teal Header that spans both sides */}
          <div className="bg-gradient-to-r from-emuski-teal-darker to-emuski-teal text-white p-6 pb-4">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-4 h-4 text-white" />
              <span className="font-semibold text-sm text-white">Let's Connect</span>
            </div>
            
            {/* LOCATIONS Title */}
            <h2 className="text-xl font-bold mb-0 text-white animate-pulse">LOCATIONS</h2>
          </div>
          
          <div className="grid lg:grid-cols-2">
            
            {/* Left Side - EMUSKI Info Section */}
            <div className="bg-white text-gray-900">
              
              <div className="p-6 pt-4">

                {/* Why EMUSKI */}
                <div className="mb-4">
                  <h3 className="font-bold text-sm mb-1 text-gray-900">Why EMUSKI?</h3>
                  <ul className="text-gray-600 text-xs leading-relaxed space-y-1">
                    <li>• 30-50% Cost Reduction through VAVE & Strategic Sourcing</li>
                    <li>• 40% Faster Time-to-Market with Complete NPD Solutions</li>
                    <li>• ISO 9001:2015 Certified Quality Management</li>
                    <li>• AI-Powered Cost Engineering & Precision Manufacturing</li>
                    <li>• 15+ Years Manufacturing Excellence</li>
                    <li>• Global Presence: India, USA, Germany, Europe, UK</li>
                  </ul>
                </div>

                {/* Registered Office */}
                <div className="mb-4">
                  <h3 className="font-bold text-sm mb-1 text-gray-900">Registered Office</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    126, RNS Plaza, Electronic City Phase 2<br />
                    Bangalore, Karnataka 560100, India
                  </p>
                </div>

                {/* Other Locations */}
                <div className="mb-6">
                  <h3 className="font-bold text-sm mb-2 text-gray-900">Other Locations</h3>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">Chennai</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">Mumbai</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">Pune</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">Hyderabad</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">USA</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">Germany</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">Europe</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">UK</span>
                    </div>
                  </div>
                </div>

                {/* General Enquiries */}
                <div className="pt-4 border-t border-gray-300">
                  <h3 className="font-bold text-sm mb-3 text-gray-900">GENERAL ENQUIRIES</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-600 text-xs">+91-86670-88060</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-600 text-xs">enquiries@emuski.com</span>
                    </div>
                  </div>

                  {/* Social Icons */}
                  <div className="flex gap-2 mt-4">
                    <a href="https://www.linkedin.com/company/e-muski/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <Linkedin className="w-3 h-3 text-gray-600" />
                    </a>
                    <a href="mailto:enquiries@emuski.com" className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <Mail className="w-3 h-3 text-gray-600" />
                    </a>
                    <a href="tel:+918667088060" className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                      <Phone className="w-3 h-3 text-gray-600" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="p-6 bg-gray-50">
              <div className="w-full">
                {/* Form Container with Border and Shadow */}
                <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4">
                  <h3 className="text-xl font-bold text-emuski-teal-darker mb-4 text-center">
                    Get Your Quote Now
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <Select onValueChange={(value) => handleChange('category', value)}>
                        <SelectTrigger className="w-full text-sm">
                          <SelectValue placeholder="Type of Process you are looking for" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cost-estimation">Cost Estimation & Analysis</SelectItem>
                          <SelectItem value="vave">VAVE & Value Engineering</SelectItem>
                          <SelectItem value="teardown-analysis">Product Teardown & Benchmarking</SelectItem>
                          <SelectItem value="strategic-sourcing">Strategic Sourcing & Supplier Management</SelectItem>
                          <SelectItem value="engineering-support">Engineering Support</SelectItem>
                          <SelectItem value="3d-printing">3D Printing (SLA, SLS, FDM, MIF)</SelectItem>
                          <SelectItem value="vmc-machining">VMC Precision Machining</SelectItem>
                          <SelectItem value="injection-molding">Injection Molding</SelectItem>
                          <SelectItem value="sheet-metal">Sheet Metal Fabrication</SelectItem>
                          <SelectItem value="complete-npd">Complete NPD Solution</SelectItem>
                          <SelectItem value="other">Other Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Full Name"
                        className="bg-white text-sm h-9"
                      />
                      <Input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => handleChange('company', e.target.value)}
                        placeholder="Your Company Name"
                        className="bg-white text-sm h-9"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="Your Business Email id"
                        className="bg-white text-sm h-9"
                      />
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="Your Phone Number"
                        className="bg-white text-sm h-9"
                      />
                    </div>

                    <div>
                      <Textarea
                        required
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        placeholder="Any Questions?"
                        className="w-full h-16 bg-white resize-none text-sm"
                      />
                    </div>

                    <div className="space-y-3">
                      {/* File Upload Area */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center relative">
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          multiple
                          disabled={uploadedFiles.length >= 5}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                          accept=".step,.stp,.sldprt,.stl,.dxf,.iges,.x_b,.3dxml,.catpart,.prt,.sat,.3mf,.jt,.dwg,.pdf,.doc,.docx"
                        />
                        <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                        <div className="text-gray-500 mb-1 text-sm">
                          {uploadedFiles.length >= 5 
                            ? 'Maximum 5 files allowed' 
                            : `Upload Parts Files (${uploadedFiles.length}/5)`}
                        </div>
                        <div className="text-xs text-gray-400">
                          Support All File Formats Including - STEP | STP | SLDPRT | STL | DXF | IGES |<br />
                          X_B | 3DXML | CATPART | PRT | SAT | 3MF | JT files
                        </div>
                      </div>

                      {/* Uploaded Files List */}
                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border text-xs">
                              <span className="text-gray-700 truncate flex-1">{file.name}</span>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {submitMessage && (
                      <div className={`text-center text-sm p-2 rounded ${submitMessage.includes('successfully') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                        {submitMessage}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-emuski-teal-darker to-emuski-teal hover:from-emuski-teal-darker hover:to-emuski-teal-darker text-white py-2 text-sm font-semibold rounded-lg disabled:opacity-50"
                    >
                      {isSubmitting ? 'Sending...' : 'Get Quote'}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}