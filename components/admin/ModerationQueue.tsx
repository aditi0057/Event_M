'use client';

import Image from 'next/image';
import { useState } from 'react';
import { approveImageApi, rejectImageApi } from '@/services/api';

interface Approval {
  _id: string;
  image_url: string;
  uploaded_by: {
    fullname: string;
    email: string;
  };
}

export const ModerationQueue = ({ initialApprovals }: { initialApprovals: Approval[] }) => {
  const [approvals, setApprovals] = useState(initialApprovals);

  const handleApprove = async (imageId: string) => {
    await approveImageApi(imageId);
    setApprovals(approvals.filter((item) => item._id !== imageId));
  };

  const handleReject = async (imageId: string) => {
    await rejectImageApi(imageId);
    setApprovals(approvals.filter((item) => item._id !== imageId));
  };

  return (
    <div className="surface p-5">
      <div className="mb-5 flex items-center justify-between border-b border-[#e8ecef] pb-4">
        <div>
          <p className="eyebrow">Moderation</p>
          <h2 className="mt-1 text-xl font-semibold text-[#1f2933]">Pending Gallery Approvals</h2>
        </div>
        <span className="bg-[#eef1f4] px-3 py-1 text-sm font-semibold text-[#667085]">{approvals.length}</span>
      </div>

      {approvals.length > 0 ? (
        <ul className="divide-y divide-[#e8ecef]">
          {approvals.map((item) => (
            <li key={item._id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Image src={item.image_url} alt="Pending approval" width={72} height={72} className="h-16 w-16 object-cover" />
                <div>
                  <p className="text-sm font-semibold text-[#1f2933]">{item.uploaded_by.fullname}</p>
                  <p className="mt-1 text-xs text-[#6b7280]">{item.uploaded_by.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleApprove(item._id)} className="bg-[#214f3a] px-3 py-2 text-xs font-semibold text-white hover:bg-[#183b2b]">Approve</button>
                <button onClick={() => handleReject(item._id)} className="bg-[#8f2d2d] px-3 py-2 text-xs font-semibold text-white hover:bg-[#742424]">Reject</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state py-10">
          <p className="text-sm">No pending gallery approvals.</p>
        </div>
      )}
    </div>
  );
};
