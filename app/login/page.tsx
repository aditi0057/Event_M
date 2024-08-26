'use client';

import { useState } from 'react';

const LoginSignupPopup = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullname: '',
    mobileNumber: '',
    dateOfBirth: '',
    maritalStatus: '',
    anniversaryDate: '',
    workJoiningDate: '',
    workAnniversaryDate: '',
    avatar: '',
    children: [],
    parents: [],
    familyChoice: ''
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [child, setChild] = useState({ childName: '', childBirthday: '' });
  const [parent, setParent] = useState({ parentName: '', parentBirthday: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChildChange = (e) => {
    setChild({ ...child, [e.target.name]: e.target.value });
  };

  const addChild = () => {
    if (child.childName && child.childBirthday) {
      setFormData({
        ...formData,
        children: [...formData.children, child]
      });
      setChild({ childName: '', childBirthday: '' });
    }
  };

  const handleParentChange = (e) => {
    setParent({ ...parent, [e.target.name]: e.target.value });
  };

  const addParent = () => {
    if (parent.parentName && parent.parentBirthday) {
      setFormData({
        ...formData,
        parents: [...formData.parents, parent]
      });
      setParent({ parentName: '', parentBirthday: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    for (const key in formData) {
      if (formData[key] === '' && key !== 'anniversaryDate' && key !== 'familyChoice') {
        newErrors[key] = 'This field is required';
      }
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    if (formData.familyChoice === 'children' && (formData.children.length === 0 || !formData.children.every(child => child.childName && child.childBirthday))) {
      newErrors.familyChoice = 'All child fields are required';
    }
    if (formData.familyChoice === 'parents' && (formData.parents.length === 0 || !formData.parents.every(parent => parent.parentName && parent.parentBirthday))) {
      newErrors.familyChoice = 'All parent fields are required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      console.log("Logged in successfully!");
      onClose();
      return;
    }

    if (!validateForm()) return;

    const url = '/api/signup';
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (Array.isArray(formData[key])) {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
      const response = await fetch(url, {
        method: 'POST',
        body: formDataToSend,
      });
      const result = await response.json();
      if (result.success) {
        onClose();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl relative h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 text-2xl">&times;</button>
        <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!isLogin && (
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="block w-full p-3 border border-gray-300 rounded"
              />
              {errors.username && <span className="text-red-500">{errors.username}</span>}
            </div>
          )}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="block w-full p-3 border border-gray-300 rounded"
            />
            {errors.email && <span className="text-red-500">{errors.email}</span>}
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="block w-full p-3 border border-gray-300 rounded"
            />
            {errors.password && <span className="text-red-500">{errors.password}</span>}
          </div>
          {!isLogin && (
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="block w-full p-3 border border-gray-300 rounded"
              />
              {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword}</span>}
            </div>
          )}
          {!isLogin && (
            <>
              <div className="col-span-2">
                <input
                  type="text"
                  name="fullname"
                  placeholder="Full Name"
                  value={formData.fullname}
                  onChange={handleChange}
                  required
                  className="block w-full p-3 border border-gray-300 rounded"
                />
                {errors.fullname && <span className="text-red-500">{errors.fullname}</span>}
              </div>
              <div>
                <input
                  type="text"
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                  className="block w-full p-3 border border-gray-300 rounded"
                />
                {errors.mobileNumber && <span className="text-red-500">{errors.mobileNumber}</span>}
              </div>
              <div>
                <label>DOB</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  placeholder="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="block w-full p-3 border border-gray-300 rounded"
                />
                {errors.dateOfBirth && <span className="text-red-500">{errors.dateOfBirth}</span>}
              </div>
              <div>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  required
                  className="block w-full p-3 border border-gray-300 rounded"
                >
                  <option value="">Select Marital Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </select>
                {errors.maritalStatus && <span className="text-red-500">{errors.maritalStatus}</span>}
              </div>
              {formData.maritalStatus === 'Married' && (
                <div>
                  <label>Anniversary</label>
                  <input
                    type="date"
                    name="anniversaryDate"
                    placeholder="Anniversary Date"
                    value={formData.anniversaryDate}
                    onChange={handleChange}
                    className="block w-full p-3 border border-gray-300 rounded"
                  />
                  {errors.anniversaryDate && <span className="text-red-500">{errors.anniversaryDate}</span>}
                </div>
              )}
              <div>
                <label>Work Joining Date</label>
                <input
                  type="date"
                  name="workJoiningDate"
                  placeholder="Work Joining Date"
                  value={formData.workJoiningDate}
                  onChange={handleChange}
                  required
                  className="block w-full p-3 border border-gray-300 rounded"
                />
                {errors.workJoiningDate && <span className="text-red-500">{errors.workJoiningDate}</span>}
              </div>
              <div>
                <label>Work Anniversary Date</label>
                <input
                  type="date"
                  name="workAnniversaryDate"
                  placeholder="Work Anniversary Date"
                  value={formData.workAnniversaryDate}
                  onChange={handleChange}
                  required
                  className="block w-full p-3 border border-gray-300 rounded"
                />
                {errors.workAnniversaryDate && <span className="text-red-500">{errors.workAnniversaryDate}</span>}
              </div>
              <div>
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full p-3 border border-gray-300 rounded"
                />
                {avatarPreview && <img src={avatarPreview} alt="Avatar Preview" className="w-32 h-32 object-cover mt-2 rounded-full" />}
                {errors.avatar && <span className="text-red-500">{errors.avatar}</span>}
              </div>
              <div>
                <select
                  name="familyChoice"
                  value={formData.familyChoice}
                  onChange={handleChange}
                  required
                  className="block w-full p-3 border border-gray-300 rounded"
                >
                  <option value="">Include Family Members</option>
                  <option value="None">None</option>
                  <option value="Parents">Parents</option>
                  <option value="Children">Children</option>
                  <option value="Both">Both</option>
                </select>
                {errors.familyChoice && <span className="text-red-500">{errors.familyChoice}</span>}
              </div>
              {formData.familyChoice === 'Children' || formData.familyChoice === 'Both' ? (
                <div>
                  <input
                    type="text"
                    name="childName"
                    value={child.childName}
                    onChange={handleChildChange}
                    placeholder="Child's Name"
                    className="block w-full p-3 border border-gray-300 rounded"
                  />
                  <input
                    type="date"
                    name="childBirthday"
                    value={child.childBirthday}
                    onChange={handleChildChange}
                    placeholder="Child's Birthday"
                    className="block w-full p-3 border border-gray-300 rounded"
                  />
                  <button type="button" onClick={addChild} className="block w-full mt-2 p-2 bg-blue-500 text-white rounded">Add Child</button>
                </div>
              ) : null}
              {formData.familyChoice === 'Parents' || formData.familyChoice === 'Both' ? (
                <div>
                  <input
                    type="text"
                    name="parentName"
                    value={parent.parentName}
                    onChange={handleParentChange}
                    placeholder="Parent's Name"
                    className="block w-full p-3 border border-gray-300 rounded"
                  />
                  <input
                    type="date"
                    name="parentBirthday"
                    value={parent.parentBirthday}
                    onChange={handleParentChange}
                    placeholder="Parent's Birthday"
                    className="block w-full p-3 border border-gray-300 rounded"
                  />
                  <button type="button" onClick={addParent} className="block w-full mt-2 p-2 bg-blue-500 text-white rounded">Add Parent</button>
                </div>
              ) : null}
            </>
          )}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white rounded"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </div>
        </form>
        <p className="mt-4 text-center">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginSignupPopup;
